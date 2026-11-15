import { randomUUID } from 'node:crypto';
import type { StoredAlert, StoredMessage } from './state';

export const SMS_MODE = process.env.SMS_MODE || 'sample';
export const isSampleSmsMode = () => SMS_MODE === 'sample';

export function generateSampleMessage(alert: StoredAlert): string {
  const region = alert.regionId === 'borena' ? 'Borena Zone, Oromia' : alert.regionId;
  return [
    'AETHER SAMPLE ALERT',
    `Reference: ${alert.reference}`,
    `Region: ${region}`,
    `Observation period: ${alert.observationPeriod}`,
    'This is a workflow simulation; no environmental measurements were assessed.',
    'Data quality: insufficient for environmental interpretation.',
    'Please investigate local conditions; this is not an official disaster declaration.',
    `Report: ${alert.reportReference}.`,
  ].join('. ');
}

export function createMockSmsProvider() {
  return {
    async dispatch(message: StoredMessage) {
      if (!isSampleSmsMode()) {
        throw new Error('Sample-only SMS policy is active; external delivery is disabled.');
      }
      return {
        reference: `SAMPLE-${randomUUID()}`,
        status: 'simulated' as const,
        timestamp: new Date().toISOString(),
        messageId: message.id,
      };
    },
  };
}

export function assertSampleMessage(message: string): void {
  if (!message.includes('SAMPLE')) throw new Error('Sample messages must include the SAMPLE label.');
}
