-- Update sites table with specific site data
DELETE FROM public.sites;

INSERT INTO public.sites (domain, schema_name, name, active) VALUES
  ('regatta-rift.lovable.app', 'site_regatta', 'Regatta Rift', true),
  ('web3analytics.lovable.app', 'site_web3analytics', 'Web3 Analytics', true),
  ('openair.lovable.app', 'site_openair', 'OpenAir Ventures', true),
  ('allyoucompany.com', 'site_allyou', 'AllYou Tools', true),
  ('buena', 'site_buena', 'Buena Tech', true),
  ('morph.', 'site_morph', 'Morph Studio', true);