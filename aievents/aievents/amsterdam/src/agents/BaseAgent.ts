import { Event, EventSource } from '@/types/event';

export abstract class BaseAgent {
  protected name: string;
  protected enabled: boolean = true;

  constructor(name: string) {
    this.name = name;
  }

  abstract getSources(): EventSource[];

  async discoverEvents(): Promise<Event[]> {
    if (!this.enabled) {
      console.log(`Agent ${this.name} is disabled, skipping...`);
      return [];
    }

    console.log(`Running agent ${this.name}...`);
    const allEvents: Event[] = [];
    const sources = this.getSources();

    for (const source of sources) {
      try {
        console.log(`Searching events from ${source.name}...`);
        const events = await source.searchEvents();
        console.log(`Found ${events.length} events from ${source.name}`);
        allEvents.push(...events);
      } catch (error) {
        console.error(`Error searching events from ${source.name}:`, error);
      }
    }

    console.log(`Agent ${this.name} found ${allEvents.length} total events`);
    return allEvents;
  }

  generateEventId(event: Partial<Event>): string {
    const hashInput = `${event.title}-${event.startDate}-${event.location}`;
    return Buffer.from(hashInput).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}