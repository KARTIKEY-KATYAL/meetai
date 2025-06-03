
import EmptyState from './empty-state';


const CancelledState = () => {
  return (
    <div className="bg-blue-950 text-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting is Cancelled"
        description="This Meeting was cancelled"
      />
  
    </div>
  );
};

export default CancelledState;
