export default function Failed({message}) {
    return (
        <div className="bg-red-100 flex border border-red-400 text-red-700 px-4 py-3 rounded">
            <span className="text-sm">{message}</span>
        </div>
    )
}
