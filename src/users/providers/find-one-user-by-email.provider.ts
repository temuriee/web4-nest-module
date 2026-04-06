import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindOneUserByEmailProvider {

constructor(@InjectRepository(User)

private readonly userRepository: Repository<User>

){}


public async findOneByEmail(email: string,){
    let user: User | null = null;

try {
    user = await this.userRepository.findOneBy({
        email:email
    })
} catch (error) {
    throw new RequestTimeoutException(error, {
        description: "Couldnt Fetch"
    })
}

}

}
