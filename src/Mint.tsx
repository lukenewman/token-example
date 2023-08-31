import { useExecuteProgram } from '@puzzlehq/sdk';
import { useState } from 'react';

function Mint() {
  const [recipient, setRecipient] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();

  const {
    execute,
    loading: execute_loading,
    transactionId,
    error,
  } = useExecuteProgram({
    programId: 'credits.aleo',
    functionName: 'mint',
    // Aleo program inputs need their types specified, our program takes in 32 bit integers
    // so the inputs should look like "2i32 3i32"
    inputs: recipient + ' ' + amount + 'u64',
  });

  return (
    <>
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
            onChange={(e: any) => {setRecipient(e.target.value)}}
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
            onChange={(e: any) => {setAmount(e.target.value)}}
          />
        </div>
      </div>
      <button 
        disabled={execute_loading || !amount || !recipient}
        onClick={execute}
      >
        mint
      </button>
      {transactionId && <span>{'Send Transaction ID: ' + transactionId}</span>}
    </>
  );
};

export default Mint;