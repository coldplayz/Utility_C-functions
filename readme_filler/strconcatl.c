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
 * strconcatl - combines multiple strings into one.
 * @n: the number of strings to concatenate.
 *
 * Tests: tested with string arguments:
 * 1. NULL, str, NULL
 * 2. str, NULL, NULL
 * 3. str, NULL, str
 * 4. NULL, NULL, str
 * Helper:
 * 1. _memncopy()
 * 2. _strlen()
 * 3. _realloc()
 * 4. handle_strlen()
 * Notes: Returned buffer is null-terminated.
 * Return: a pointer to the buffer containing the concatenated strings.
 * This buffer has to be free'd when done with.
 */
char *strconcatl(int n, ...)
{
	va_list ap;
	char *buff = NULL, *str;
	int i, j, k;
	size_t len = 0, old_len;

	va_start(ap, n);
	j = 0;
	for (i = 0; i < n; i++)
	{
		str = va_arg(ap, char *);
		old_len = len;
		len = handle_strlen(str, len, i, n);
		if (len != old_len)
		{
			buff = _realloc(buff, (sizeof(char) * old_len), (sizeof(char) * len));
			if (!buff)
			{
				perror("realloc");
				return (NULL);
			}
		}

		k = 0;
		for (; j < (int)len; j++)
		{
			/* concatenate each string to the buffer */
			/* The IF...ELSE block handles the case where str is NULL, and...*/
			/*...it happens to be the last string in the list. In that case,...*/
			/*...the increased value of length would permit entrance into...*/
			/*...this FOR loop. So, we prevent the illegal reading of NULL */
			/* important: the last [non-NULL] concatenated string...*/
			/*...has to be null-terminated, as it's null byte will be copied */
			if (str)
				buff[j] = str[k++];
			else
				buff[j] = 0;
		}
	}
	va_end(ap);
	return (buff);
}
