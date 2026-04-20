import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { Paginated } from '../interfaces/paginated.interface';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class PaginationProvider {
  /**
   * Use Constructor to Inject Request
   * */
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    // Fetch the data with pagination
    let results = await repository.find({
      // paginationQuery = 1 , then skip = 0, paginationQuery = 2, then skip = 10
      // take = 10 means fetch 10 items
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    /**
     * Create the request URLs
     */

    // http://localhost:3000/posts?limit=10&page=2
    // this.request.protocol = http
    // this.request.headers.host = localhost:3000
    // this.request.url = /posts?limit=10&page=2
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);

    // Calculate page numbers
    // totalItems = 45
    // totalPages = 5
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      // paginationQuery.page = 2, totalPages = 5
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page - 1;

    let finalResponse = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        currentPage: paginationQuery.page,
        totalPages: Math.ceil(totalItems / paginationQuery.limit),
      },
      links: {
        // newUrl.origin = http://localhost:3000
        // newUrl.pathname = /posts
        // limit = paginationQuery.limit = 10
        // page = 1, totalPages = 5
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
