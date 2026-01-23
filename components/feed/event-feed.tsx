"use client";

import { useEventsStore } from "@/stores/events-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventCard } from "./event-card";
import { FeedFilters } from "./feed-filters";
import { Loader2 } from "lucide-react";

export function EventFeed() {
  const { filteredEvents, isLoading, error, selectedEvent,  selectEvent } =
    useEventsStore();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Event Feed</h2>
        <p className="text-sm text-muted-foreground">
          {filteredEvents.length} events
        </p>
      </div>

      <FeedFilters />

      <ScrollArea className="flex-1 p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading events...
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No events match your filters
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              isSelected={selectedEvent?.id === event.id}
              onClick={() => selectEvent(event)}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
