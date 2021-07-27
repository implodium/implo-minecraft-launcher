export default interface MemoryInfo {
    total: number
    free: number
    used: number
    active: number
    buffers: number
    cached: number
    slab: number
    buffcache: number,
    swaptotal: number
    swapused: number
    swapfree: number
}
