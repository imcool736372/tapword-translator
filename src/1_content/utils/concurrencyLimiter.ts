/**
 * Concurrency limiter utility
 * Controls parallel executions with a FIFO queue.
 */

export type RequestLimiter = <T>(fn: () => Promise<T>) => Promise<T>

export function createConcurrencyLimiter(limit: number): RequestLimiter {
    let activeCount = 0
    const queue: Array<() => void> = []

    const next = () => {
        if (activeCount >= limit) {
            return
        }
        const task = queue.shift()
        if (!task) {
            return
        }
        activeCount++
        task()
    }

    return async function limitFn<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const run = () => {
                fn()
                    .then(resolve)
                    .catch(reject)
                    .finally(() => {
                        activeCount--
                        next()
                    })
            }
            queue.push(run)
            next()
        })
    }
}
