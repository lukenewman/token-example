import { useAccount, useRecords} from '@puzzlehq/sdk';
import { useEffect } from 'react';

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
  console.log('records');

  useEffect(() => {
    request();
  }, []);

  if (!isConnected) {
    throw new Error('dashboard shouldn\'t be showing rn');
  }

  if (loading) {
    return <>loading...</>
  }

  return (
    <>
      <div className='w-full fixed top-0 h-16 border-b flex justify-between items-center px-8'>
        <span className='text-3xl font-bold'>Build-A-Token</span>
        <span className="text-m">
          {shortenAddress(account!.address)}
        </span>
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-10'>
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
              />
            </div>
          </div>
          <button>send</button>
        </div>
        <div className='max-h-30% overflow-y-auto w-1/2 border rounded-lg flex flex-col items-center justify-center gap-4 p-4'>
          <span className='text-xl font-bold'>Records</span>
          {records?.map(r => {
            return (
              <div>{r.id}</div>
            )
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;