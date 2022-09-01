#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

#define ps(x) (printf("%s\n", x))
#define pd(x) (printf("%d\n", x))

/**
 * handle_realloc - handles reallocation of memory to str_ar.
 * @i: the value of the index tracking the number of elements in str_ar.
 * @str_ar: address of a double pointer previously allocated memory.
 * @bsize: the unit memory size for str_ar.
 * @bsize_total: address of the variable
 * representing the total size of the str_ar buffer.
 */
void handle_realloc(char ***str_ar, int i, int bsize, int *bsize_total)
{
	char **tmp;

	if (i >= (*bsize_total / bsize))
	{
		*bsize_total += bsize;
		tmp = realloc(*str_ar, *bsize_total);
		if (!tmp)
		{
			printf("Realloc error\n");
			exit(99);
		}

		*str_ar = tmp;
	}
}
