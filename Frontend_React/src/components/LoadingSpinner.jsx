// Dans LoadingSpinner.jsx
export default function LoadingSpinner({ fullPage = false }) {
    return (
        <div className={`flex justify-center items-center ${fullPage ? 'min-h-screen' : ''}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-600"></div>
        </div>
    )
}