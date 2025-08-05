import React, { useState } from 'react';
import { Search, Star, User, Music, Calendar, Clock } from 'lucide-react';

// Sample data with MusicBrainz IDs for real album covers
const sampleAlbums = [
  {
    id: 1,
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    musicbrainz_id: "f5093c06-23e3-404f-aeaa-40f72885ee3a",
    tracks: [
      { number: 1, title: "Speak to Me", duration: "1:30" },
      { number: 2, title: "Breathe (In the Air)", duration: "2:43" },
      { number: 3, title: "On the Run", duration: "3:36" },
      { number: 4, title: "Time", duration: "7:06" },
      { number: 5, title: "Money", duration: "6:23" }
    ],
    averageRating: 9.2,
    totalRatings: 15420
  },
  {
    id: 2,
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    musicbrainz_id: "dc38ede5-fbc6-4f8b-a5d6-4dea5e5b2d09",
    tracks: [
      { number: 1, title: "Come Together", duration: "4:20" },
      { number: 2, title: "Something", duration: "3:03" },
      { number: 3, title: "Maxwell's Silver Hammer", duration: "3:27" }
    ],
    averageRating: 9.0,
    totalRatings: 18392
  },
  {
    id: 3,
    title: "OK Computer",
    artist: "Radiohead",
    year: 1997,
    musicbrainz_id: "0b6b4ba0-d36f-47bd-b4ea-6d7b6a6e8df7",
    tracks: [
      { number: 1, title: "Airbag", duration: "4:44" },
      { number: 2, title: "Paranoid Android", duration: "6:23" },
      { number: 3, title: "Karma Police", duration: "4:21" }
    ],
    averageRating: 8.8,
    totalRatings: 12053
  },
  {
    id: 4,
    title: "Pet Sounds",
    artist: "The Beach Boys",
    year: 1966,
    tracks: [
      { number: 1, title: "Wouldn't It Be Nice", duration: "2:31" },
      { number: 2, title: "You Still Believe in Me", duration: "2:30" }
    ],
    averageRating: 8.7,
    totalRatings: 7234
  }
];

const artists = [
  { name: "Pink Floyd", albums: [1] },
  { name: "The Beatles", albums: [2] },
  { name: "Radiohead", albums: [3] },
  { name: "The Beach Boys", albums: [4] }
];

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRatings, setUserRatings] = useState({});

  const handleLogin = () => {
    setCurrentUser({ id: 1, name: "Demo User" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRate = (albumId, rating) => {
    if (!currentUser) {
      alert('Please log in to rate albums');
      return;
    }
    setUserRatings({ ...userRatings, [albumId]: rating });
  };

  const getAlbumCover = (album) => {
    // High-quality, stable album cover URLs that work when deployed
    const covers = {
      1: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
      2: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg", 
      3: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
      4: "https://upload.wikimedia.org/wikipedia/en/b/bb/PetSoundsCover.jpg"
    };
    
    // Fallback to a reliable placeholder service for missing covers
    return covers[album.id] || `https://picsum.photos/400/400?random=${album.id}`;
  };

  const filteredAlbums = searchQuery.trim() === '' 
    ? sampleAlbums 
    : sampleAlbums.filter(album =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getTopRatedAlbums = () => [...sampleAlbums].sort((a, b) => b.averageRating - a.averageRating);
  const getPopularAlbums = () => [...sampleAlbums].sort((a, b) => b.totalRatings - a.totalRatings);
  const getNewAlbums = () => [...sampleAlbums].sort((a, b) => b.year - a.year);

  const StarRating = ({ rating, onRate, userRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    return (
      <div className="flex items-center space-x-3">
        <div className="flex">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 cursor-pointer transition-colors ${
                star <= (hoverRating || userRating || 0)
                  ? 'text-emerald-500 fill-current'
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onRate && onRate(star)}
            />
          ))}
      );

  const ArtistPage = ({ artist }) => {
    const artistAlbums = sampleAlbums.filter(album => 
      artist.albums.includes(album.id)
    );

    return (
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => setCurrentView('home')}
          className="mb-8 text-emerald-600 hover:text-emerald-700 flex items-center font-medium"
        >
          ← Back to Albums
        </button>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-4xl font-light text-gray-900 mb-8">{artist.name}</h1>
          
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Albums</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {artistAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Music className="w-7 h-7 text-emerald-600" />
              <span 
                className="text-xl font-light text-gray-900 cursor-pointer"
                onClick={() => {
                  setCurrentView('home');
                  setSearchQuery('');
                }}
              >
                33rpm
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <HomePage />}
        {currentView === 'album' && selectedAlbum && <AlbumPage album={selectedAlbum} />}
        {currentView === 'artist' && selectedArtist && <ArtistPage artist={selectedArtist} />}
        {currentView === 'top-rated' && <TopRatedPage />}
        {currentView === 'popular' && <PopularPage />}
        {currentView === 'new-albums' && <NewAlbumsPage />}
      </main>
    </div>
  );
}

export default App;>
        <span className="text-sm text-gray-500">
          {userRating ? `Your rating: ${userRating}/10` : 'Rate this album'}
        </span>
      </div>
    );
  };

  const AlbumCard = ({ album }) => {
    const coverUrl = getAlbumCover(album);
    const [imageError, setImageError] = useState(false);
    const colors = ['bg-emerald-600', 'bg-red-600', 'bg-blue-600', 'bg-orange-600'];
    const colorClass = colors[album.id % colors.length];
    
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        onClick={() => {
          setSelectedAlbum(album);
          setCurrentView('album');
        }}
      >
        <div className="aspect-square overflow-hidden">
          {!imageError ? (
            <img 
              src={coverUrl}
              alt={album.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center ${colorClass} text-white p-4`}>
              <Music className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="font-bold text-lg text-center leading-tight mb-2">
                {album.title.length > 20 ? album.title.substring(0, 20) + '...' : album.title}
              </h3>
              <p className="text-sm opacity-90 text-center mb-2">{album.artist}</p>
              <p className="text-xs opacity-70">{album.year}</p>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm">{album.title}</h3>
          <p className="text-gray-600 mb-3 truncate text-sm">{album.artist}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{album.year}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-emerald-500 fill-current" />
              <span className="text-xs font-medium text-gray-900">{album.averageRating}</span>
              <span className="text-xs text-gray-500">({album.totalRatings.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="space-y-8">
      <div className="text-center py-16 bg-white border-b border-gray-200">
        <h1 className="text-5xl font-light text-gray-900 mb-4">33rpm</h1>
        <p className="text-xl text-gray-600 font-light">Discover and rate music albums</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search albums or artists..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center space-x-8">
        <button 
          onClick={() => setCurrentView('top-rated')}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Top Rated
        </button>
        <button 
          onClick={() => setCurrentView('popular')}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Most Popular
        </button>
        <button 
          onClick={() => setCurrentView('new-albums')}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          New Releases
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-8">
          {searchQuery ? 'Search Results' : 'Featured Albums'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAlbums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  );

  const AlbumPage = ({ album }) => {
    const coverUrl = getAlbumCover(album);
    const [imageError, setImageError] = useState(false);
    const colors = ['bg-emerald-600', 'bg-red-600', 'bg-blue-600', 'bg-orange-600'];
    const colorClass = colors[album.id % colors.length];
    
    return (
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => setCurrentView('home')}
          className="mb-8 text-emerald-600 hover:text-emerald-700 flex items-center font-medium"
        >
          ← Back to Albums
        </button>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="aspect-square">
                {!imageError ? (
                  <img 
                    src={coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center ${colorClass} text-white p-8`}>
                    <Music className="w-20 h-20 mb-6 opacity-80" />
                    <h3 className="font-bold text-2xl text-center leading-tight mb-4">
                      {album.title}
                    </h3>
                    <p className="text-lg opacity-90 text-center mb-3">{album.artist}</p>
                    <p className="text-sm opacity-70">{album.year}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-light text-gray-900 mb-3">{album.title}</h1>
              <p 
                className="text-xl text-gray-600 mb-6 cursor-pointer hover:text-emerald-600 transition-colors underline"
                onClick={() => {
                  const artist = artists.find(a => a.name === album.artist);
                  if (artist) {
                    setSelectedArtist(artist);
                    setCurrentView('artist');
                  }
                }}
              >
                {album.artist}
              </p>
              
              <div className="flex items-center space-x-6 mb-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{album.year}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-emerald-500 fill-current" />
                  <span className="font-medium text-gray-900">{album.averageRating}/10</span>
                  <span className="text-gray-500 ml-2">({album.totalRatings.toLocaleString()} ratings)</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rate this album</h3>
                <StarRating 
                  rating={album.averageRating}
                  userRating={userRatings[album.id]}
                  onRate={(rating) => handleRate(album.id, rating)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Track List</h3>
            <div className="space-y-1">
              {album.tracks.map(track => (
                <div key={track.number} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <span className="w-8 text-gray-400 text-sm font-medium">{track.number}</span>
                    <span className="text-gray-900">{track.title}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TopRatedPage = () => {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-light text-gray-900">Top Rated Albums</h1>
          <button 
            onClick={() => setCurrentView('home')}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="space-y-1">
            {getTopRatedAlbums().map((album, index) => {
              const coverUrl = getAlbumCover(album);
              const [imageError, setImageError] = useState(false);
              
              return (
                <div 
                  key={album.id} 
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setSelectedAlbum(album);
                    setCurrentView('album');
                  }}
                >
                  <div className="w-12 text-gray-500 font-medium text-lg">#{index + 1}</div>
                  <div className="w-16 h-16 mr-4 flex-shrink-0">
                    {!imageError ? (
                      <img 
                        src={coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover rounded"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded bg-gray-200">
                        <Music className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{album.title}</h3>
                    <p className="text-gray-600 truncate">{album.artist}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">{album.year}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-emerald-500 fill-current" />
                      <span className="font-medium text-gray-900">{album.averageRating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const PopularPage = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-light text-gray-900">Most Popular Albums</h1>
        <button 
          onClick={() => setCurrentView('home')}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          ← Back to Home
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="space-y-1">
          {getPopularAlbums().map((album, index) => {
            const coverUrl = getAlbumCover(album);
            const [imageError, setImageError] = useState(false);
            
            return (
              <div 
                key={album.id} 
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setSelectedAlbum(album);
                  setCurrentView('album');
                }}
              >
                <div className="w-12 text-gray-500 font-medium text-lg">#{index + 1}</div>
                <div className="w-16 h-16 mr-4 flex-shrink-0">
                  {!imageError ? (
                    <img 
                      src={coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover rounded"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded bg-gray-200">
                      <Music className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{album.title}</h3>
                  <p className="text-gray-600 truncate">{album.artist}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">{album.year}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-emerald-500 fill-current" />
                    <span className="font-medium text-gray-900">{album.averageRating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const NewAlbumsPage = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-light text-gray-900">New Releases</h1>
        <button 
          onClick={() => setCurrentView('home')}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          ← Back to Home
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {getNewAlbums().map(album => {
          const coverUrl = getAlbumCover(album);
          const [imageError, setImageError] = useState(false);
          const colors = ['bg-emerald-600', 'bg-red-600', 'bg-blue-600', 'bg-orange-600'];
          const colorClass = colors[album.id % colors.length];
          
          return (
            <div 
              key={album.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => {
                setSelectedAlbum(album);
                setCurrentView('album');
              }}
            >
              <div className="aspect-square overflow-hidden">
                {!imageError ? (
                  <img 
                    src={coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center ${colorClass} text-white p-4`}>
                    <Music className="w-12 h-12 mb-4 opacity-80" />
                    <h3 className="font-bold text-lg text-center leading-tight mb-2">
                      {album.title.length > 20 ? album.title.substring(0, 20) + '...' : album.title}
                    </h3>
                    <p className="text-sm opacity-90 text-center mb-2">{album.artist}</p>
                    <p className="text-xs opacity-70">{album.year}</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm">{album.title}</h3>
                <p className="text-gray-600 mb-3 truncate text-sm">{album.artist}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{album.year}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-emerald-500 fill-current" />
                    <span className="text-xs font-medium text-gray-900">{album.averageRating}</span>
                    <span className="text-xs text-gray-500">({album.totalRatings.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div