import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

export default function RoomLinkBar() {
    const [roomURL] = useState(()=> window.location.href);
    const handleCopy = () => {
        navigator.clipboard.writeText(roomURL).then(() => {
            console.log("Copied successfully!");
        });
    };

    return (
        <div className="fixed md:bottom-3 bottom-24 left-4 z-10 flex items-center gap-2 bg-white backdrop-blur-sm p-2 rounded-lg shadow-md">
            <input
                className="sm:w-[220px] w-[165px] px-1 py-1.5 rounded focus:outline-none focus:ring-0"
                value={roomURL}
                readOnly
            />
            <ContentCopyIcon onClick={handleCopy} className="cursor-pointer active:scale-[1.2]" />
        </div>

    );
}
