import React from 'react'

const Avatar = ({ name, size = 'md', src, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const getInitials = (name) => {
    const names = name.split(' ')
    return names
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold ${
        sizes[size]
      } ${
        src
          ? 'bg-cover bg-center'
          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
      } ${className}`}
      style={src ? { backgroundImage: `url(${src})` } : null}
    >
      {!src && getInitials(name)}
    </div>
  )
}

export default Avatar