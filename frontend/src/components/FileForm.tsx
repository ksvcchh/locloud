import { useRef, useState, type ChangeEvent } from "react";

export interface FileFormProps {
  onFileSelect: (file: File) => void;
}

export default function FileForm({ onFileSelect }: FileFormProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenFile = event.target.files?.[0];
    if (chosenFile) {
      onFileSelect(chosenFile);
      setCurrentFile(chosenFile);
    }
  };

  const handleFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <>
      <div className="flex flex-col m-auto items-center justify-center w-screen">
        <div className="flex flex-row gap-4 items-center">
          <div
            className="size-50 bg-gray-500 border-dashed border-gray-800 rounded-xl text-[#f1cf93] text-xl flex justify-center items-center opacity-75 hover:cursor-pointer"
            onClick={handleFileInput}
          >
            Select an image!
          </div>

          <div className="flex size-100 items-center justify-center border border-dotted rounded-xl">
            {currentFile && (
              <img
                className="m-auto max-w-full max-h-full"
                src={URL.createObjectURL(currentFile)}
                alt=""
              />
            )}
            {!currentFile && (
              <div className="text-5xl text-amber-700">
                No
                <br />
                Image
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpg, image/jpeg"
      />
    </>
  );
}
