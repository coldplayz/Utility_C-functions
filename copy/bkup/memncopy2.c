#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include "main.h"

#define ps(x) printf("%s\n", x)
#define pd(x) printf("%d\n", x)
#define plu(x) printf("%lu\n", x)


/**
 * _memncpy - copies n bytes from memory area src to memory area dest
 * @dest: memory area to be filled
 * @src: src from which to copy bytes
 * @n: integer determining number of bytes (characters) to be copied
 */
void _memncpy(void *dest, void *src, unsigned int n)
{
	unsigned int i;

	for (i = 0; i < n; i++)
	{
		*((char *)dest + i) = *((char *)src + i);
	}
}
