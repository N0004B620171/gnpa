export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}