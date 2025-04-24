'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleSeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seed', {
        method: 'POST'
      });
      
      const data = await response.json();
      setResult(data.message || data.error);
    } catch (error) {
      setResult('Failed to seed data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Database Seeding</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          This will create sample data in your database including:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Organization user (OrgTest@email.com)</li>
          <li>Volunteer user (test12@test.com)</li>
          <li>Test event</li>
          <li>Volunteer history entry</li>
        </ul>
        <Button
          onClick={handleSeed}
          disabled={loading}
        >
          {loading ? 'Seeding...' : 'Seed Database'}
        </Button>
        {result && (
          <p className={`mt-4 p-4 rounded ${
            result.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {result}
          </p>
        )}
      </div>
    </div>
  );
} 