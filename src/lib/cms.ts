import 'server-only';
import {cache} from 'react';
import {connection} from 'next/server';
import {getPayload} from 'payload';
export const getCMS=cache(async()=>{await connection();const {default:config}=await import('../payload.config');return getPayload({config});});
