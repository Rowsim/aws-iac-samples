import { Entity, Column, JoinColumn, ManyToOne, Generated, PrimaryColumn } from "typeorm"
import { Office } from "./Office";

@Entity()
export class Employee {

    @Generated('uuid')
    @PrimaryColumn('uuid')
    public id!: number

    @Column({ type: 'varchar' })
    public name!: string

    @Column({ type: 'int' })
    public age!: number

    @ManyToOne(() => Office)
    @JoinColumn()
    public office!: Office;
}
