import { Entity, Column, PrimaryColumn, Generated } from "typeorm"

@Entity()
export class Office {

    @Generated('uuid')
    @PrimaryColumn('uuid')
    public officeId!: string

    @Column({ type: 'varchar' })
    public name!: string

    @Column({type: 'int'})
    public capacity!: number
}
