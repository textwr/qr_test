import { IoIosMenu } from "react-icons/io";

function App() {
  return (
    <>
      <div className="max-w-sm mx-auto w-full h-[500px">
        <div className="w-full flex justify-between">
          <div>
            <IoIosMenu size={28} />
          </div>
          <div className="flex gap-4">
            <p>login</p>
            <p>signin</p>
          </div>
        </div>
        <h1 className=" font-bold text-gray-900 py-4 text-center border-b border-gray-400">
          QR Scanner
        </h1>
      </div>
    </>
  );
}

export default App;
