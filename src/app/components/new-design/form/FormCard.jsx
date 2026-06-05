import React from 'react'

function FormCard({children}) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">{children}</div>
  )
}

export default FormCard