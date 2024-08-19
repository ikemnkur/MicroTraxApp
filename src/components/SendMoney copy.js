import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send money logic here
    console.log('Sending', amount, 'to', recipient);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Send Money</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Recipient Username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
            <Button type="submit" className="w-full">Send Money</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMoney;
