-- marketing.leads.origem: acrescenta 'geral_agendamento' (home geral da LogCodex).
-- Banco: Supabase de produção do site e do Fleet (aszyawanzldsvohkomov).
-- Autorizado pelo Leo em 11/10/2026 ("3. Sim"); aplicado em 12/10/2026.
--
-- Esta regra NÃO estava em nenhuma migration (a do Fleet, 050_marketing_leads.sql,
-- não tem a coluna origem): foi criada direto no banco na Fase 1 do
-- reposicionamento e ampliada para a /hospedagem em 09/10. Este arquivo é o
-- primeiro registro dela. Antes desta mudança, lida no banco em 11/10:
--   CHECK ((origem = ANY (ARRAY['lancamento','home_diagnostico','home_agendamento',
--                               'home_whatsapp','hospedagem_agendamento'])))
--
-- Toda origem nova enviada pelo site precisa entrar aqui ANTES de ir ao ar.

BEGIN;

ALTER TABLE marketing.leads DROP CONSTRAINT leads_origem_check;

ALTER TABLE marketing.leads ADD CONSTRAINT leads_origem_check CHECK (
  origem = ANY (ARRAY[
    'lancamento',              -- /lancamento (funil antigo do Fleet)
    'home_diagnostico',        -- home de logística (formulário antigo)
    'home_agendamento',        -- agenda da página de logística (hoje em /logistica)
    'home_whatsapp',           -- home de logística (WhatsApp)
    'hospedagem_agendamento',  -- agenda da /hospedagem
    'geral_agendamento'        -- agenda da home geral (sistemas sob medida), 12/10/2026
  ])
);

COMMIT;

-- Volta atrás (só se nenhuma linha usar 'geral_agendamento'):
-- BEGIN;
-- ALTER TABLE marketing.leads DROP CONSTRAINT leads_origem_check;
-- ALTER TABLE marketing.leads ADD CONSTRAINT leads_origem_check CHECK (origem = ANY (ARRAY[
--   'lancamento','home_diagnostico','home_agendamento','home_whatsapp','hospedagem_agendamento']));
-- COMMIT;
