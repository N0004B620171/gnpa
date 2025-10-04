import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function DataTable({
  data,
  columns,
  actions = [],
  searchable = true,
  filters = null,
  onSearch = null,
}) {
  const [search, setSearch] = useState('');

  const handleSearch = (value) => {
    setSearch(value);
    onSearch?.(value);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header avec recherche et filtres */}
      {(searchable || filters) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            {searchable && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            {filters}
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              data.data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {actions.map((action, actionIndex) => (
                          <Link
                            key={actionIndex}
                            href={action.href(row)}
                            className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition-colors ${
                              action.variant === 'danger' 
                                ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50'
                            }`}
                          >
                            {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                            {action.label}
                          </Link>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.links && data.links.length > 3 && (
        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
              Affichage de <span className="font-medium">{data.from}</span> à{' '}
              <span className="font-medium">{data.to}</span> sur{' '}
              <span className="font-medium">{data.total}</span> résultats
            </div>
            <div className="flex space-x-1">
              {data.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    link.active
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  preserveScroll
                >
                  {link.label.includes('Previous') ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : link.label.includes('Next') ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}