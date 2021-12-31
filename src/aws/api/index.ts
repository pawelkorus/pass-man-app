import { Authentication } from '../../api'
import { Credentials } from "@aws-sdk/types";

export type AWSAuthentication = Credentials & Authentication
