const Spinner = () => {
    return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500">
        </div>
        <p className="text-gray-500 text-xl ml-3">Loading...</p>
    </div>
    );
};
  
export default Spinner;