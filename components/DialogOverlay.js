const DialogOverlay = ({ children }) => (
  <div className="bg-gray-300 z-40 w-screen min-h-screen bg-opacity-75 fixed left-0 top-0 flex">
    <div
      className={
        "bg-gray-500 text-white m-auto p-5 rounded-sm shadow-2xl z-50 flex flex-col items-center justify-center content-center"
      }
    >
      {children}
    </div>
  </div>
);

export default DialogOverlay;
