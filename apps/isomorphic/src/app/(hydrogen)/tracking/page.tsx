'use client';

import { useState } from 'react';
import { Input, Button, Text, Badge } from 'rizzui';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { usePublicTracking } from '@/hooks/use-shipment';
import { STATUS_BADGE_CONFIG } from '@/types/shipment.types';

export default function PublicTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: trackingData,
    isLoading,
    error,
  } = usePublicTracking(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(trackingNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Track Your Shipment
          </h1>
          <p className="text-gray-600">
            Enter your tracking number to see the latest updates
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking number (e.g., TRK12345...)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
              size="lg"
            />
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              disabled={!trackingNumber || trackingNumber.length < 6}
            >
              <PiMagnifyingGlassBold className="h-5 w-5" />
              Track
            </Button>
          </div>
        </form>

        {/* Results */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <Text className="text-red-600">
              Unable to find shipment with tracking number: {searchTerm}
            </Text>
          </div>
        )}

        {trackingData && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <Text className="text-sm text-gray-600">Tracking Number</Text>
                  <Text className="text-xl font-bold">
                    {trackingData.trackingNumber}
                  </Text>
                </div>
                <Badge
                  variant={
                    STATUS_BADGE_CONFIG[trackingData.status].variant as any
                  }
                  color={STATUS_BADGE_CONFIG[trackingData.status].color as any}
                  className="text-sm"
                >
                  {STATUS_BADGE_CONFIG[trackingData.status].label}
                </Badge>
              </div>

              {trackingData.estimatedDelivery && (
                <div>
                  <Text className="text-sm text-gray-600">
                    Estimated Delivery
                  </Text>
                  <Text className="font-medium">
                    {new Date(
                      trackingData.estimatedDelivery
                    ).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </div>
              )}
            </div>

            {/* Tracking History */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">Tracking History</h2>
              {trackingData.trackingHistory.length === 0 ? (
                <Text className="text-center text-gray-500">
                  No tracking updates yet
                </Text>
              ) : (
                <div className="space-y-6">
                  {trackingData.trackingHistory.map((entry, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            index === 0 ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></div>
                        {index < trackingData.trackingHistory.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-300 py-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <Text className="font-semibold">
                          {new Date(entry.timestamp).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </Text>
                        {entry.location && (
                          <Text className="text-sm text-gray-600">
                            {entry.location}
                          </Text>
                        )}
                        {entry.description && (
                          <Text className="mt-1 text-gray-700">
                            {entry.description}
                          </Text>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!trackingData && !error && searchTerm && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Text className="text-gray-500">
              Enter a tracking number to see shipment details
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
