import { UpdateNoFlatten, OriDocumentReference } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValues'
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference`. The update will fail if applied to a document that does
 * not exist.
 *
 * @param reference - A reference to the document to update.
 * @param data - An object containing the fields and values with which to
 * update the document. Fields can contain dots to reference nested fields
 * within the document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export const updateDocNoFlatten: UpdateNoFlatten = (reference, data) => {
	return (
		// @ts-expect-error
		(reference as OriDocumentReference)
			//
			.update(removeFieldValueInhomogeneousProps(data))
	)
}
