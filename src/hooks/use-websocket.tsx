import { useState, useEffect, useRef, useCallback } from 'react'
import { WSMessage } from '../types/game-types'

export function useWebSocket(url: string) {
  const [connectionState, setConnectionState] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected')
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }
    
    setConnectionState('connecting')
    
    try {
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setConnectionState('connected')
        reconnectAttempts.current = 0
        
        // Send initial handshake
        ws.send(JSON.stringify({
          type: 'HANDSHAKE',
          data: { playerId: localStorage.getItem('playerId') || `player-${Date.now()}` },
          timestamp: Date.now()
        }))
      }
      
      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          setLastMessage(message)
          
          // Handle ping/pong for connection health
          if (message.type === 'PING') {
            ws.send(JSON.stringify({
              type: 'PONG',
              data: message.data,
              timestamp: Date.now()
            }))
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setConnectionState('disconnected')
        wsRef.current = null
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, delay)
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionState('disconnected')
      }
      
      wsRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setConnectionState('disconnected')
    }
  }, [url])
  
  const sendMessage = useCallback((message: Omit<WSMessage, 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WSMessage = {
        ...message,
        timestamp: Date.now()
      }
      wsRef.current.send(JSON.stringify(fullMessage))
      return true
    } else {
      console.warn('WebSocket not connected, message not sent:', message)
      return false
    }
  }, [])
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect')
      wsRef.current = null
    }
    
    setConnectionState('disconnected')
  }, [])
  
  // Auto-connect on mount
  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])
  
  return {
    connectionState,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  }
}