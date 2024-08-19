import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    balance: 0,
    accountTier: 1,
    sentTransactions: 0,
    receivedTransactions: 0,
    dailyLimit: 100 // This should be based on the account tier
  });

  useEffect(() => {
    // Fetch user data from the backend
    // setUserData(fetchedData);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${userData.balance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.accountTier}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sent: {userData.sentTransactions} / {userData.dailyLimit}</p>
            <p>Received: {userData.receivedTransactions} / {userData.dailyLimit}</p>
            <Progress value={(userData.sentTransactions + userData.receivedTransactions) / (userData.dailyLimit * 2) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
