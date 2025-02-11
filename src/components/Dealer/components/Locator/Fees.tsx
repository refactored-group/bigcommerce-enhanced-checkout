export default function Fees(props: any): any {
  const { fees } = props;

  if (fees.length == 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p>Dealer Fees</p>
      <ul className="text-sm text-gray-500">
        {
          fees.map(function (fee: any, index: number) {
            return (<li key={index}>{`${fee.name}: ${fee.amount}`}</li>)
          })
        }
      </ul>
    </div>
  );
}
