-- Add code column to regattas table for password protection
ALTER TABLE public.regattas 
ADD COLUMN code character varying(50) NULL;
