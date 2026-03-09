import { useState } from "react";
import FileForm from "./FileForm";
import Button from "./Button";

export default function ResizeMenu() {
  const [, setCurrentFile] = useState<File | null>(null);
  const [newImg] = useState("");
  const handleResize = () => {
    // API CALL
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <FileForm onFileSelect={setCurrentFile} />
      <Button text="Resize" callback={handleResize} />
      {newImg}
    </div>
  );
}
