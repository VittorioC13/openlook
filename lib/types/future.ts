// P1: enable providers only after explicit privacy consent and a supported runtime.
export interface TryOnProvider { generate(input:{illustratedLook:string}):Promise<{jobId:string}> }
export interface TryOnJob { id:string;state:'queued'|'processing'|'complete'|'failed';result?:string }
// P2: intentional boundaries; no social, commerce, subscriptions, or hardware implementation.
export interface FutureSocialProfile { handle:string }
export interface FutureCommerceListing { garmentId:string }
export interface FutureSubscription { planId:string }
