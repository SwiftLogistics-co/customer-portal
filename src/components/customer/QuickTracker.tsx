import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const QuickTracker: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const navigate = useNavigate();

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/orders/${trackingInput.trim()}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Quick Track
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrackOrder} className="flex gap-2">
          <Input
            placeholder="Enter order ID or tracking number..."
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Track</Button>
        </form>
      </CardContent>
    </Card>
  );
};
