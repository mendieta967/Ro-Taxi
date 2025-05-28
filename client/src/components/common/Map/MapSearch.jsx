const MapSearch = ({type, title, ref, activeInput, handleActiveInput, handleInputChange, value}) => {
    return(
        <div className={`w-full relative transition-all`}>
          <label className="text-yellow-400 font-semibold mb-1 text-sm block tracking-wide">{title}</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-yellow-400 text-xl">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#FFD600" strokeWidth="2"/><rect x="10" y="10" width="4" height="4" fill="#FFD600"/></svg>
            </span>
            <input
              ref={ref}
              type="text"
              onFocus={() => handleActiveInput(type)}
              onBlur={() => handleActiveInput(null)}
              value={value}
              onChange={(e) => {
                handleInputChange(type, e.target.value);
              }}
              placeholder="¿A dónde querés ir?"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${activeInput === type ? 'border-yellow-400 shadow-yellow-200/20 shadow-lg' : 'border-[#23262F] shadow-md'} text-base outline-none bg-[#23262F] text-yellow-400 font-medium mb-0 transition-all`}
              autoComplete="off"
            />            
          </div>
        </div>
    )
}

export default MapSearch