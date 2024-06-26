import fs from '@react-native-firebase/firestore'
import { Delete } from '../types'

/**
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */
export const deleteField = () => fs.FieldValue.delete() as Delete
