/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config';
import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import { importMap } from './importMap';
import React from 'react';
import './custom.scss';

import type { ServerFunctionClient } from 'payload';

type Args = {
  children: React.ReactNode;
};

const serverFunctions: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default async function Layout({ children }: Args) {
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunctions}>{children}</RootLayout>;
}
