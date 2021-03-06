import { FirelordUtils } from './firelordUtils'
import { FirelordFirestore } from './firelordFirestore'
import { queryCreator } from './queryCreator'
import { Firelord } from './index_'
import { docCreator } from './docCreator'
import { createTime } from './utils'

export const firelord: Firelord = (firestore: FirelordFirestore.Firestore) => {
	const { createdAt } = createTime(firestore)

	return {
		wrapper: <T extends FirelordUtils.MetaType = never>() => {
			type Write = FirelordUtils.InternalReadWriteConverter<T>['write']
			type WriteNestedCreate =
				FirelordUtils.InternalReadWriteConverter<T>['writeNestedCreate']
			type Read = FirelordUtils.InternalReadWriteConverter<T>['read']
			const col = (collectionPath: T['colPath']) => {
				const colRefWrite = firestore().collection(
					collectionPath
				) as FirelordFirestore.CollectionReference<Write>
				const colRefRead =
					colRefWrite as FirelordFirestore.CollectionReference<Read>

				// https://github.com/microsoft/TypeScript/issues/32022
				// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
				// conclusion: do not spread
				return {
					parent: colRefRead.parent,
					path: colRefRead.path,
					id: colRefRead.id,
					doc: docCreator<T, 'col'>(firestore, colRefWrite, undefined),
					add: (data: WriteNestedCreate) => {
						return colRefWrite
							.add({
								...createdAt,
								...data,
							})
							.then(documentReference => {
								return docCreator<T, 'col'>(
									firestore,
									colRefWrite,
									documentReference
								)(documentReference.id)
							})
					},
					...queryCreator<T>(firestore, colRefRead, colRefRead),
				}
			}

			const colGroup = (collectionPath: T['colName']) => {
				const colRefRead = firestore().collectionGroup(
					collectionPath
				) as FirelordFirestore.CollectionGroup<Read>
				return queryCreator<T, never, 'colGroup'>(
					firestore,
					undefined,
					colRefRead
				)
			}
			return { col, colGroup }
		},
		fieldValue: {
			increment: (value: number) => {
				return firestore.FieldValue.increment(
					value
				) as unknown as FirelordUtils.NumberMasked
			},
			serverTimestamp: () => {
				return firestore.FieldValue.serverTimestamp() as unknown as FirelordUtils.ServerTimestampMasked
			},
			arrayUnion: <T extends string, Y>(key: T, ...values: Y[]) => {
				return (values.length > 0
					? {
							[key]: firestore.FieldValue.arrayUnion(...values),
					  }
					: {}) as unknown as {
					[key in T]: FirelordUtils.ArrayMasked<Y>
				}
			},
			arrayRemove: <T extends string, Y>(key: T, ...values: Y[]) => {
				return (values.length > 0
					? {
							[key]: firestore.FieldValue.arrayRemove(...values),
					  }
					: {}) as unknown as {
					[key in T]: FirelordUtils.ArrayMasked<Y>
				}
			},
		},
		batch: () => {
			return firestore().batch()
		},
		runTransaction: (
			updateFunction: (
				transaction: FirelordFirestore.Transaction
			) => Promise<unknown>
		) => {
			return firestore().runTransaction(updateFunction)
		},
	}
}

export const ozai: typeof firelord = firelord

export { flatten } from './utils'

export type { FirelordUtils }

export type { FirelordFirestore }
