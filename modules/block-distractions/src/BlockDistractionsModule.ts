import { NativeModule, requireNativeModule } from 'expo';

declare class BlockDistractionsModule extends NativeModule<{}> {}

export default requireNativeModule<BlockDistractionsModule>('BlockDistractions');
