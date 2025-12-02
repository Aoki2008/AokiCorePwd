import localDataService from './local/service';
import remoteDataService from './remote/service';

// Determine which service to export based on environment variable
const useRemote = import.meta.env.VITE_DATA_MODE === 'remote';
const dataService = useRemote ? remoteDataService : localDataService;

export default dataService;
