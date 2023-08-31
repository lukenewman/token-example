import { Record, useAccount, useExecuteProgram, useRecords } from '@puzzlehq/sdk';
import { useEffect, useState } from 'react';
import Mint from './Mint';

export const shortenAddress = (
  address: string,
) => {
  const length = 5;
  if (address.length < length * 2) return address;
  return `${address.slice(
    0,
    10
  )}...${address.slice(address.length - length, address.length)}`;
};

function Dashboard() {
  const { account, isConnected, loading } = useAccount();
  const { records, request } = useRecords({
    filter: { program_id: 'credits.aleo', type: 'unspent' }
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [maxSpendable, setMaxSpendable] = useState(0);

  const [recipient, setRecipient] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const [record, setRecord] = useState<Record | undefined>();

  const {
    execute,
    loading: execute_loading,
    transactionId,
    error,
  } = useExecuteProgram({
    programId: 'credits.aleo',
    functionName: 'transfer_private',
    // Aleo program inputs need their types specified, our program takes in 32 bit integers
    // so the inputs should look like "2i32 3i32"
    inputs: record?.plaintext ?? '' + ' ' + recipient + ' ' + amount + 'u64',
  });

  useEffect(() => {
    request();
  }, []);

  useEffect(() => {
    if (records) {
      let total = 0;
      let max = 0;
      records.forEach(r => {
        const credits = Number(r.plaintext.split('microcredits:')[1].split('u64')[0]) / 1_000_000;
        total += credits;
        max = Math.max(credits, max);
      });
      setTotalBalance(total);
      setMaxSpendable(max);
    }
  }, [records]);

  useEffect(() => {
    execute();
  }, [record]);

  if (!isConnected) {
    throw new Error('dashboard shouldn\'t be showing rn');
  }

  if (loading) {
    return <>loading...</>
  }

  const onRecipientChange = (e: any) => {
    setRecipient(e.target.value);
  }

  const onAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const send = () => {
    if (!records) {
      console.log('send called with no records');
      return;
    }
    const recordToSpendIndex = records.findIndex(r => {
      const credits = Number(r.plaintext.split('microcredits:')[1].split('u64')[0]) / 1_000_000;
      if (credits > Number(amount!)) {
        console.log('setting record', r);
        return r;
      }
    });
    if (recordToSpendIndex < 0) {
      console.log('could not find record to spend');
      return;
    }
    const recordToSpend = records[recordToSpendIndex];
    console.log(`sending ${amount} to ${recipient} with ${recordToSpend}`);
    setRecord(recordToSpend);
  };

  return (
    <>
      <Header address={account!.address} />
      <div className='w-full flex flex-col items-center justify-center gap-10'>
        <div className='w-1/2 border rounded-lg flex flex-col p-4'>
          <div className='w-full flex justify-between'>
            <span className='font-bold'>Total Balance</span>
            <span>{totalBalance.toFixed(2)}</span>
          </div>
          <div className='w-full flex justify-between'>
            <span className='font-bold'>Max Spendable Balance</span>
            <span>{maxSpendable.toFixed(2)}</span>
          </div>
        </div>
        <div className='w-1/2 border rounded-lg flex flex-col items-center justify-center gap-4 p-4'>
          <span className='text-xl font-bold'>Transfer</span>
          <div className='w-[80%]'>
            <label htmlFor="recipient" className="block text-sm font-medium leading-6">
              Recipient
            </label>
            <div className="mt-2">
              <input
                name="recipient"
                id="recipient"
                className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="aleo168l7zt7686ns54qmweda5ngs28c9jr6rdehlezdcv6ssr899m5qq4f4qgy"
                onChange={onRecipientChange}
              />
            </div>
          </div>
          <div className='w-[80%]'>
            <label htmlFor="amount" className="block text-sm font-medium leading-6">
              Amount
            </label>
            <div className="mt-2">
              <input
                name="amount"
                id="amount"
                className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="10"
                onChange={onAmountChange}
              />
            </div>
          </div>
          <button disabled={execute_loading || !amount || !recipient} onClick={send}>send</button>
          {transactionId && <span>{'Send Transaction ID: ' + transactionId}</span>}
        </div>
        {account?.address === '' && (
          <Mint />
        )}
      </div>
    </>
  );
};

export default Dashboard;

function Header({address}: {address: string}) {
  return (
    <div className='w-full fixed top-0 h-16 border-b flex justify-between items-center px-8'>
      <span className='text-3xl font-bold'>Build-A-Token</span>
      <span className="text-m">
        {shortenAddress(address)}
      </span>
    </div>
  );
}
