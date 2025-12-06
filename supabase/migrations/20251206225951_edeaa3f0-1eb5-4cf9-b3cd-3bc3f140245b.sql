-- Add whatsapp column to participation_requests table
ALTER TABLE public.participation_requests 
ADD COLUMN whatsapp text;