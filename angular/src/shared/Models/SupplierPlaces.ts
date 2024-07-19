export class SupplierPlaces {
        constructor(
                public id: number=0,
                public name: string | undefined='',
                public eventCategory: string | undefined='',
                public contactEmail: string | undefined='',
                public capacity: number | undefined=0,
                public price: number | undefined=0,
                public location: string | undefined='',
                public image: string | undefined='',
                public description: string | undefined='',
                public imagePath: File | undefined=undefined,
        ) {
        }
}