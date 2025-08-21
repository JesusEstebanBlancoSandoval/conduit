import { Entity, EntityRepositoryType, HiddenProps, ManyToMany, Opt, PrimaryKey, Property, Collection, wrap, EntityDTO } from "@mikro-orm/core";
import { IsEmail } from 'class-validator';
//hace falta definir userrepository y articulo
@Entity({ repository: () => UserRepository })
export class User {
    [EntityRepositoryType]?: UserRepository;
    @PrimaryKey()
    id!: number

    @Property()
    username!: string

    @Property({ hidden: true })
    @IsEmail()
    email!: string

    @Property()
    bio: string & Opt = '';

    @Property()
    image: string & Opt = '';

    @Property({ hidden: true })
    password!: string;

    @ManyToMany({ hidden: true })
    favorites = new Collection<Article>(this);

    @ManyToMany({ hidden: true })
    followers = new Collection<User>(this);

    @ManyToMany(() => User, user => user.followers, { hidden: true })
    followed = new Collection<User>(this);

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    tpJson(user?: User) {
        const o = wrap<User>(this).toObject() as UserDTO;
        o.image = this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg';
        o.following = user && user.followers.isInitialized() && user.followers.contains(this);

        return o;
    }
}

//data transefer object objeto para moverlo a lo largo del backend
interface UserDTO extends EntityDTO<User> {
    following?: boolean;


}