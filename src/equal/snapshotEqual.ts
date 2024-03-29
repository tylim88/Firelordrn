import { DocumentSnapshot, QuerySnapshot, OriDocumentSnapshot } from '../types'

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export const snapshotEqual = <
	T extends DocumentSnapshot<any> | QuerySnapshot<any>,
	U extends T
>(
	left: T,
	right: U
) => {
	return (left as unknown as OriDocumentSnapshot).isEqual(
		right as unknown as OriDocumentSnapshot
	)
}
