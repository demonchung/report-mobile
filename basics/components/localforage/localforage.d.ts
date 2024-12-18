declare namespace H3{
  namespace localforage{

    interface storageInstance{
      isExpired(key: number): boolean,
      getItem<T>(key: string): Promise<T | null>,
      setItem<T>(key: string, value: T): Promise<T | null>,
      removeItem(key: string, callback?: (err: any) => void): Promise<void>
    }

    interface storageOpt {
      name: string,
      driver?: Array<string> | string,
      size?: number,
      description?: string
    }
  }
}