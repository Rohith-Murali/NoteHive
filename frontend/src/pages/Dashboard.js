export default function Dashboard() {
    return (
        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="p-4 border border-secondary rounded-xl hover:shadow-md bg-white"
                >
                    <h3 className="text-lg font-semibold mb-2">Sample Note {i}</h3>
                    <p className="text-sm text-secondary">This is a sample note preview.</p>
                </div>
            ))}
        </div>
    )
}
